// https://github.com/rhvall/MinaDevContainer
// Based on code from https://github.com/o1-labs/docs2, https://github.com/br0wnD3v/zkApp_Base
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

export {};

function loadCOIServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    window.location.hostname != 'localhost'
  ) {
    const coi = window.document.createElement('script');
    coi.setAttribute('src', '../public/coi-serviceworker.min.js'); // update if your repo name changes for npm run deploy to work successfully
    window.document.head.appendChild(coi);
  }
}

loadCOIServiceWorker();
