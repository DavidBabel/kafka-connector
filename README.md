# Kafka Connector

This module is used to send messages to Kafka

## Install

To install it in your project, think to fix the version using this kind of command :

```
yarn add Ogury/kafka-connector#v1.X.X
```

## Requirements

if you want to import this npm module in your project, you have to define the following environnement variables :

```
ZOOKEEPER_HOSTS
KAFKA_CLIENT_ID  # most of the time : the app name
KAFKA_TOPIC  # default

# and / or (if others topics are needed)
KAFKA_TOPIC_<name1>
KAFKA_TOPIC_<name2>
# etc ...
```

## Usage

To use the kafka connector here is the API :

```javascript
import {client, producer, sendMessage, getStatus} from 'kafka-connector';

// send message into a specific topic
sendMessage(message: Object, topic: string)
// getStatus of connection for healthCheck
getStatus() : Promise<Object>

// connectors are also available, but should not be needed directly
client :Client
producer :HighLevelProducerFinal

```

To use the helpers in your tests :

```javascript
import {initKafkaSpy, expectedCreatedStatsCountIs, getCreatedStat} from 'kafka-connector/helpers';

describe('Test', () => {
  beforeEach(async function () {
    initKafkaSpy();
  });

  it('should fun my test', async function () {
    // do stuffs ...
    expectedCreatedStatsCountIs(1);
    const createdStats = getCreatedStat(0);
    // do stuffs ...
  }
});
```

## Usage with health controller

```javascript
import healthController, {addHealthCheck} from 'health-controller';
import {getStatus as getKafkaStatus} from 'kafka-connector';

addHealthCheck(getKafkaStatus);
app.use('/health', healthController);
```

## Work on it

### Quickstart

```
yarn install
yarn build
```

### Tests

```
yarn test
```