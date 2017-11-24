/* @flow */

const defaultConfig = {
  ENV_NAME: 'local',
  ZOOKEEPER_HOSTS: 'localhost:2181',
  KAFKA_CLIENT_ID: 'kafka-node-client',
  KAFKA_TOPIC: 'default'
};

// extract topic list from env, see README.md
function getTopicList(env) {
  const topics = [];
  for (const envVar in env) {
    if (envVar.startsWith('KAFKA_TOPIC')) {
      topics.push(env[envVar]);
    }
  }
  return topics;
}

function getConfig(env: Object) {
  const config: Object = !env.ENV_NAME || env.ENV_NAME === 'local' ? defaultConfig : env;

  return {
    envName: config.ENV_NAME,
    zookeeperHosts: config.ZOOKEEPER_HOSTS,
    kafka: {
      topics: getTopicList(env),
      clientId: config.KAFKA_CLIENT_ID
    }
  };
}

export default getConfig(process.env);
