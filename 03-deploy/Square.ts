// https://github.com/rhvall/MinaDevContainer
// Based on code from https://github.com/o1-labs/docs2
// May 2023
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { Field, SmartContract, state, State, method } from 'snarkyjs';

export class Square extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(3));
  }

  @method update(square: Field) {
    const currentState = this.num.get();
    this.num.assertEquals(currentState);
    square.assertEquals(currentState.mul(currentState));
    this.num.set(square);
  }
}
