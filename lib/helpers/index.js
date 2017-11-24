import sinon from 'sinon';
import {assert} from 'chai';
import {producer} from '../connectors/kafka';

let kafkaSpy;

export function initKafkaSpy() {
  if (kafkaSpy) {
    kafkaSpy.restore();
  }
  kafkaSpy = sinon.spy(producer, 'send');
}

export function expectedCreatedStatsCountIs(count) {
  assert.equal(kafkaSpy.callCount, count);
}

export function getCreatedStat(number) {
  return JSON.parse(kafkaSpy.getCall(number).args[0][0].messages[0]);
}
