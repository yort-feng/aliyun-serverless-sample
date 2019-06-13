const TableStore = require('tablestore');

const { Long } = TableStore;

async function getClient(context) {
  return new TableStore.Client({
    accessKeyId: context.credentials.accessKeyId,
    secretAccessKey: context.credentials.accessKeySecret,
    stsToken: context.credentials.securityToken,
    endpoint: process.env.Endpoint,
    instancename: process.env.InstanceName,
  });
}

async function getAllReflections(client, pageSize, pageNum) {
  const res = await client.search({
    tableName: process.env.TableName,
    indexName: 'idx_company',
    searchQuery: {
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      query: {
        queryType: TableStore.QueryType.MATCH_ALL_QUERY,
      },
      getTotalCount: true,
    },
    columnToGet: {
      returnType: TableStore.ColumnReturnType.RETURN_SPECIFIED,
      returnNames: ['type', 'content', 'creator', 'tos', 'time_stamp'],
    },
  });
  const endRow = Number.parseInt(res.totalCounts, 10);
  const hasNextPage = res.totalCounts > pageSize * pageNum;
  const hasPreviousPage = pageNum !== 1;
  const list = res.rows.map((row) => {
    const reflection = {};
    row.attributes.forEach((attribute) => {
      reflection[attribute.columnName] = attribute.columnValue;
    });
    row.primaryKey.forEach((attribute) => {
      reflection[attribute.name] = attribute.value;
    });
    return reflection;
  });
  return {
    hasNextPage,
    hasPreviousPage,
    endRow,
    list,
  };
}
async function create(client, reflection) {
  const currentTimeStamp = Date.now();
  const params = {
    tableName: process.env.TableName,
    // 不管此行是否已经存在，都会插入新数据，如果之前有会被覆盖。condition的详细使用说明，请参考conditionUpdateRow.js
    condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
    primaryKey: [{ company: Long.fromNumber(1), id: TableStore.PK_AUTO_INCR }],
    attributeColumns: [
      { type: reflection.type },
      { content: reflection.content }, // '2', 'timestamp': currentTimeStamp },
      { creator: reflection.creator },
      { tos: reflection.tos },
      { time: currentTimeStamp },
    ],
    returnContent: { returnType: TableStore.ReturnType.Primarykey },
  };
  const primaryKey = await client.putRow(params);
  return `创建成功, primaryKey为:  ${JSON.stringify(primaryKey)}`;
}

module.exports.handler = (event, context, callback) => {
  const request = JSON.parse(event.toString());
  (async () => {
    const client = await getClient(context);
    let { httpMethod } = request;
    if (!httpMethod) {
      httpMethod = 'GET';
    }
    let responseBody = '';
    if (httpMethod === 'GET') { // show list.
      const queryParameters = request.queryParameters || {};
      const pageSize = queryParameters.pageSize || 10;
      const pageNum = queryParameters.pageNum || 1;
      const relections = await getAllReflections(client, pageSize, pageNum);
      responseBody = JSON.stringify(relections);
      // FC给API网关返回的格式，须如下所示。isBase64Encoded根据body是否Base64编码情况设置
    } else if (httpMethod === 'POST') {
      if (request.isBase64Encoded !== null && request.isBase64Encoded) {
        request.body = Buffer.from(request.body, 'base64').toString();
      }
      const reflection = JSON.parse(request.body);
      responseBody = await create(client, reflection);
    }
    const response = {
      isBase64Encoded: false,
      statusCode: 200,
      body: responseBody,
    };
    callback(null, response);
  })();
};
