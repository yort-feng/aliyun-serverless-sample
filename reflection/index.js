'use strict';

const TableStore = require('tablestore');
const Long = TableStore.Long;

async function getClient(context) {
    return new TableStore.Client({
        accessKeyId: context.credentials.accessKeyId,
        secretAccessKey: context.credentials.accessKeySecret,
        stsToken: context.credentials.securityToken,
        endpoint: process.env['Endpoint'],
        instancename: process.env['InstanceName']
    });
}

async function getAllReflections(client, pageSize, pageNum) {
    let res = await client.search({
        tableName: process.env['TableName'],
        indexName: "idx_company",
        searchQuery: {
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            query: {
                queryType: TableStore.QueryType.MATCH_ALL_QUERY
            },
            getTotalCount: true,
        },
        columnToGet: {
            returnType: TableStore.ColumnReturnType.RETURN_SPECIFIED,
            returnNames: ["type", "content", "creator", "tos", "time_stamp"]
        }
    });
    let endRow = parseInt(res.totalCounts);
    let hasNextPage = res.totalCounts > pageSize * pageNum;
    let hasPreviousPage = pageNum !== 1;
    let list = res.rows.map((row)=>{
        let reflection = {};
        row.attributes.forEach((attribute)=>{
            reflection[attribute.columnName] = attribute.columnValue;
        })
        row.primaryKey.forEach((attribute)=>{
            reflection[attribute.name] = attribute.value;
        })
        return reflection;
    });
    return {
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        endRow: endRow,
        list: list
    };
}
async function create(client, reflection){
    var currentTimeStamp = Date.now();
    var params = {
        tableName: process.env['TableName'],
        //不管此行是否已经存在，都会插入新数据，如果之前有会被覆盖。condition的详细使用说明，请参考conditionUpdateRow.js
        condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
        primaryKey: [{ 'company': Long.fromNumber(1), 'id': TableStore.PK_AUTO_INCR }],
        attributeColumns: [
            { 'type': reflection.type },
            { 'content': reflection.content }, //'2', 'timestamp': currentTimeStamp },
            { 'creator': reflection.creator },
            { 'tos': reflection.tos },
            { 'time': currentTimeStamp}
        ],
        returnContent: { returnType: TableStore.ReturnType.Primarykey }
    };

    let primaryKey = await client.putRow(params, function (err, data) {
        if (err) {
            console.log('error:', err);
            return;
        }

        console.log('success:', data);
    });
    return "创建成功, primaryKey为: "+JSON.stringify(primaryKey);
}

module.exports.handler = function(event, context, callback) {
    console.log('event: ' + event);
    let request =JSON.parse(event.toString());
    (async () => {
        const client = await getClient(context);
        let httpMethod = request.httpMethod;
        if(!httpMethod){
            httpMethod = 'GET';
        }
        console.log("HttpMethod: "+httpMethod);
        var responseBody = "";
        if(httpMethod === 'GET'){//show list.
            let queryParameters = request.queryParameters||{};
            let pageSize = queryParameters.pageSize||10;
            let pageNum = queryParameters.pageNum||1;
            var relections = await getAllReflections(client, parseInt(pageSize), parseInt(pageNum));
            responseBody= JSON.stringify(relections);
            //FC给API网关返回的格式，须如下所示。isBase64Encoded根据body是否Base64编码情况设置
        }else if(httpMethod === 'POST'){
            if(request.isBase64Encoded!==null&&request.isBase64Encoded!==undefined&&request.isBase64Encoded){
                request.body=new Buffer(request.body,'base64').toString();
            }
            let reflection = JSON.parse(request.body);
            responseBody = await create(client, reflection);
        }
        var response = {
            isBase64Encoded: false,
            statusCode: 200,
            body: responseBody
        };
        console.log("response: " + JSON.stringify(response));
        callback(null, response);
    })();

};