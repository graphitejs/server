import { fork } from 'redux-saga/effects';
import Todos from './todos';

export default function* () {
  yield [
    fork(Todos),
  ];
}
