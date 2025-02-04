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

import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PrivateKey,
  PublicKey,
  Poseidon,
} from 'snarkyjs';

// These private keys are exported so that experimenting with the contract is
// easy. Three of them (the Bobs) are used when the contract is deployed to
// generate the public keys that are allowed to post new messages. Jack's key
// is never added to the contract. So he won't be able to add new messages. In
// real life, we would only use the Bobs' public keys to configure the contract,
// and only they would know their private keys.

export const users = {
  Bob: PrivateKey.fromBase58(
    'EKFAdBGSSXrBbaCVqy4YjwWHoGEnsqYRQTqz227Eb5bzMx2bWu3F'
  ),
  SuperBob: PrivateKey.fromBase58(
    'EKEitxmNYYMCyumtKr8xi1yPpY3Bq6RZTEQsozu2gGf44cNxowmg'
  ),
  MegaBob: PrivateKey.fromBase58(
    'EKE9qUDcfqf6Gx9z6CNuuDYPe4XQQPzFBCfduck2X4PeFQJkhXtt'
  ), // This one says duck in it :)
  Jack: PrivateKey.fromBase58(
    'EKFS9v8wxyrrEGfec4HXycCC2nH7xf79PtQorLXXsut9WUrav4Nw'
  ),
};

export class MessageBoard extends SmartContract {
  // On-chain state definitions
  @state(Field) message = State<Field>();
  @state(Field) messageHistoryHash = State<Field>();
  @state(PublicKey) user1 = State<PublicKey>();
  @state(PublicKey) user2 = State<PublicKey>();
  @state(PublicKey) user3 = State<PublicKey>();

  @method init() {
    // Define initial values of on-chain state
    this.user1.set(users['Bob'].toPublicKey());
    this.user2.set(users['SuperBob'].toPublicKey());
    this.user3.set(users['MegaBob'].toPublicKey());
    this.message.set(Field(0));
    this.messageHistoryHash.set(Field(0));
  }

  @method publishMessage(message: Field, signerPrivateKey: PrivateKey) {
    // Compute signerPublicKey from signerPrivateKey argument
    const signerPublicKey = signerPrivateKey.toPublicKey();

    // // Get approved public keys
    const user1 = this.user1.get();
    this.user1.assertEquals(user1);
    const user2 = this.user2.get();
    this.user2.assertEquals(user2);
    const user3 = this.user3.get();
    this.user3.assertEquals(user3);

    // Assert that signerPublicKey is one of the approved public keys
    signerPublicKey
      .equals(user1)
      .or(signerPublicKey.equals(user2))
      .or(signerPublicKey.equals(user3))
      .assertEquals(true);
    // Update on-chain message state
    this.message.set(message); // Computer new messageHistoryHash

    // Compute new messageHistoryHash
    const oldHash = this.messageHistoryHash.get();
    this.messageHistoryHash.assertEquals(oldHash);
    const newHash = Poseidon.hash([message, oldHash]);

    // Update on-chain state
    this.messageHistoryHash.set(newHash);
  }
}
