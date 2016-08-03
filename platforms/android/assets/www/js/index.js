/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    autoShowInterstitial: false,
    progressDialog: document.getElementById("progressDialog"),
    spinner: document.getElementById("spinner"),
    weinre: {
        enabled: false,
        ip: '', // ex. http://192.168.1.13
        port: '', // ex. 9090
        targetApp: '' // ex. see weinre docs
    },
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        if ((/(ipad|iphone|ipod|android)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            app.onDeviceReady();
        }
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    initAds: function () {
        var isAndroid = (/(android)/i.test(navigator.userAgent));
        var adPublisherIds = {
            ios: {
                banner: 'ca-app-pub-9863325511078756/5232547029',
                interstitial: 'ca-app-pub-9863325511078756/6709280228'
            },
            android: {
                banner: 'ca-app-pub-3865303354621707/6329836072',
                interstitial: 'ca-app-pub-3865303354621707/2822052470'
            }
        };
        var admobid;
    
        if (isAndroid) {
            admobid = adPublisherIds.android;
        } else {
            admobid = adPublisherIds.ios;
        }
        if (window.admob) {
            admob.setOptions({
                             publisherId: admobid.banner,
                             interstitialAdId: admobid.interstitial,
                             bannerAtTop: true, // set to true, to put banner at top
                             overlap: false, // set to true, to allow banner overlap webview
                             offsetStatusBar: true, // set to true to avoid ios7 status bar overlap
                             isTesting: true, // receiving test ads (do not test with real ads as your account will be banned)
                             autoShowBanner: true, // auto show banners ad when loaded
                             autoShowInterstitial: false // auto show interstitials ad when loaded
                         });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser1? It won\'t work...');
        }
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        if (window.admob) {
            document.addEventListener("orientationchange", this.onOrientationChange, false);
            document.addEventListener(admob.events.onAdLoaded, this.onAdLoaded, false);
            document.addEventListener(admob.events.onAdFailedToLoad, this.onAdFailedToLoad, false);
            document.addEventListener(admob.events.onAdOpened, function (e) { }, false);
            document.addEventListener(admob.events.onAdClosed, function (e) { }, false);
            document.addEventListener(admob.events.onAdLeftApplication, function (e) { }, false);
            document.addEventListener(admob.events.onInAppPurchaseRequested, function (e) { }, false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser2? It won\'t work...');
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onOrientationChange: function () {
        app.onResize();
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var weinre,
        weinreUrl;
        
        document.removeEventListener('deviceready', app.onDeviceReady, false);
        
        if (app.weinre.enabled) {
            console.log('Loading weinre...');
            weinre = document.createElement('script');
            weinreUrl = app.weinre.ip + ":" + app.weinre.port;
            weinreUrl += '/target/target-script-min.js';
            weinreUrl += '#' + app.weinre.targetApp;
            weinre.setAttribute('src', weinreUrl);
            document.head.appendChild(weinre);
        }
        
        if (window.admob) {
            console.log('Binding ad events...');
            app.bindAdEvents();
            console.log('Initializing ads...');
            app.initAds();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser3? It won\'t work...');
        }
    },
    // Update DOM on a Received Event
    onAdLoaded: function (e) {
        app.showProgress(false);
        if (window.admob && e.adType === window.admob.AD_TYPE.INTERSTITIAL) {
            if (app.autoShowInterstitial) {
                window.admob.showInterstitialAd();
            } else {
                alert("Interstitial is available. Click on 'Show Interstitial' to show it.");
            }
        }
    },
    onAdFailedToLoad: function (e) {
        app.showProgress(false);
        alert("Could not load ad: " + JSON.stringify(e));
    },
    onResize: function () {
        var msg = 'Web view size: ' + window.innerWidth + ' x ' + window.innerHeight;
        document.getElementById('sizeinfo').innerHTML = msg;
    },
    
    // -----------------------------------
    // App buttons functionality
    // -----------------------------------
    startBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.createBannerView(function () { }, function (e) {
                                          alert(JSON.stringify(e));
                                      });
        }
    
    },
    removeBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.destroyBannerView();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser5? It won\'t work...');
        }
    },
    showBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showBannerAd(true, function () { }, function (e) {
                                      alert(JSON.stringify(e));
                                  });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser6? It won\'t work...');
        }
    },
    hideBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showBannerAd(false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser7? It won\'t work...');
        }
    },
    requestInterstitial: function (autoshow) {
        if (window.admob) {
            app.showProgress(true);
            app.autoShowInterstitial = autoshow;
            window.admob.requestInterstitialAd(function () { }, function (e) {
                                               alert(JSON.stringify(e));
                                           });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser8? It won\'t work...');
        }
    },
    showInterstitial: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showInterstitialAd(function () { }, function (e) {
                                            alert(JSON.stringify(e));
                                        });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser9? It won\'t work...');
        }
    },
    showProgress: function (show) {
        if (show) {
            addClass(app.spinner, "animated");
            removeClass(app.progressDialog, "hidden");
        } else {
            addClass(app.progressDialog, "hidden");
            removeClass(app.spinner, "animated");
        }
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function removeClass(elem, cls) {
    var str;
    do {
        str = " " + elem.className + " ";
        elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
    } while (str.match(cls));
}

function addClass(elem, cls) {
    elem.className += (" " + cls);
}

