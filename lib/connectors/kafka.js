/* eslint-disable flowtype/no-types-missing-file-annotation */

import config from '../config';
import { Client, HighLevelProducer } from 'kafka-node';

class ClientMock {
  loadMetadataForTopics(data: Array<any>, cb: () => void) {
    cb();
  }
  refreshMetadata(data: Array<any>, cb: () => void) {
    cb();
  }
  on() {}
  close() {}
}
class HighLevelProducerMock {
  send(data: any, cb: () => void) {
    cb();
  }
  on() {}
  close() {}
}

let _producerIsReady: boolean = process.env.NODE_ENV === 'test' ? true : false;
const ClientFinal = process.env.NODE_ENV === 'test' ? ClientMock : Client;
const HighLevelProducerFinal =
  process.env.NODE_ENV === 'test' ? HighLevelProducerMock : HighLevelProducer;

export const client = new ClientFinal(
  config.zookeeperHosts,
  config.kafka.clientId
);
export const producer = new HighLevelProducerFinal(client, {
  requireAcks: 0,
  partitionerType: 3
});

function send(payload) {
  return new Promise((resolve, reject) => {
    producer.send(payload, function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
}

export function sendMessage(message: Object, topic: string) {
  if (!_producerIsReady) {
    throw new Error('Producer is not ready, aborting');
  }

  const serializedMessage = JSON.stringify(message);
  const key = message.key; // for partionerType:3 = KeyedPartioner

  const payloads = [
    {
      topic,
      key,
      messages: [serializedMessage]
    }
  ];

  return send(payloads);
}

export function getStatus(): Promise<Object> {
  return new Promise((resolve, reject) => {
    client.loadMetadataForTopics(config.kafka.topics, function(err, metadata) {
      if (err) {
        return reject({ kafka: false, err });
      }

      if (
        metadata &&
        metadata.length === 2 &&
        Object.keys(metadata[0]).length > 0
      ) {
        const metadataError = metadata[1]['error'];
        if (metadataError) {
          return reject({ kafka: false, err: { message: metadataError } });
        }
        const metadataDetail = metadata[1]['metadata'];
        for (const key in metadataDetail) {
          if (Object.keys(metadataDetail[key]).length === 0) {
            return reject({
              kafka: false,
              err: { message: 'No keys found in metadatas' }
            });
          }
        }
        resolve({ kafka: true, producer: _producerIsReady });
      } else {
        reject({ kafka: false, err: { message: 'Invalid metadatas' } });
      }
    });
  });
}

if (process.env.NODE_ENV !== 'test') {
  producer.on('ready', () => {
    client.refreshMetadata(config.kafka.topics, () => {
      console.log('Kafka producer is ready');
      _producerIsReady = true;
    });
  });

  producer.on('error', function(err) {
    console.log('error', err);
    producer.close();
    client.close();
    process.exit(1);
  });
}
