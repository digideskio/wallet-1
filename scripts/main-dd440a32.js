"use strict";angular.module("wallet",["ngRoute","ngStorage"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"partials/wallet.html",controller:"WalletCtrl"}).otherwise({redirectTo:"/"})}]);var RATES={gbp:1,usd:.58,eur:.8},FLOAT_REGEXP=/^\-?\d+((\.|\,)\d+)?$|^$/;angular.module("wallet").controller("WalletCtrl",["$scope","$localStorage",function(a,t){a.$storage=t.$default({currency:"gbp",lastId:0,transactions:[],balance:0}),a.newTransaction=function(t){a.$storage.transactions.push({id:++a.$storage.lastId,amount:t,date:+new Date})},a.inputKeydown=function(a,t){13===a.keyCode&&t()},a.deposit=function(){if(a.depositAmount){var t=a.depositAmount*RATES[a.$storage.currency];a.newTransaction(t),a.$storage.balance+=t,a.depositAmount=""}},a.withdraw=function(){if(a.withdrawAmount&&!a.form.withdrawAmount.$error.overdraft){var t=a.withdrawAmount*RATES[a.$storage.currency];a.newTransaction(-t),a.$storage.balance-=t,a.withdrawAmount=""}}}]).filter("icon",function(){return function(a){return"fa-"+a}}).filter("currency",function(){return function(a,t){return(a/RATES[t]).toFixed(2)}}).filter("formatDate",function(){return function(a){return new Date(a).toISOString().slice(11,19)}}).directive("transactionList",function(){return{restrict:"E",templateUrl:"partials/transaction-list.html"}}).directive("smartFloat",function(){return{require:"ngModel",link:function(a,t,r,n){n.$parsers.unshift(function(a){return FLOAT_REGEXP.test(a)?(n.$setValidity("float",!0),parseFloat(a.replace(",","."))):void n.$setValidity("float",!1)})}}}).directive("noOverdraft",function(){return{require:"ngModel",link:function(a,t,r,n){n.$parsers.unshift(function(t){return t<=a.$storage.balance?n.$setValidity("overdraft",!0):n.$setValidity("overdraft",!1),t})}}}),function(a){try{a=angular.module("wallet")}catch(t){a=angular.module("wallet",[])}a.run(["$templateCache",function(a){a.put("partials/transaction-list.html",'<table class="table table-bordered"><thead><tr><th>no.</th><th>Amount</th><th>Date</th></tr></thead><tbody><tr ng-repeat="item in $storage.transactions | orderBy: \'-date\'" ng-class="(item.amount &gt;= 0) ? \'success\' : \'danger\'"><td>{{ item.id }}</td><td><div ng-class="$storage.currency | icon" class="fa"></div>{{ item.amount | currency: $storage.currency }}</td><td>{{ item.date | formatDate }}</td></tr></tbody></table>')}])}(),function(a){try{a=angular.module("wallet")}catch(t){a=angular.module("wallet",[])}a.run(["$templateCache",function(a){a.put("partials/wallet.html",'<nav role="navigation" class="navbar navbar-default"><div class="container"><div class="navbar-header"><button type="button" data-toggle="collapse" data-target="#navbar-collapse" class="navbar-toggle"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a href="/" class="navbar-brand">Wallet</a></div><div id="navbar-collapse" class="collapse navbar-collapse"><ul class="nav navbar-nav"><li><a href="/">Home</a></li><li><a href="#" ng-click="$storage.$reset()">Reset</a></li><li><a href="https://github.com/tvararu/wallet/">View source</a></li></ul></div></div></nav><div ng-controller="WalletCtrl" class="container wallet-wrapper"><div class="btn-group btn-group-justified"><div ng-class="{ active: $storage.currency === \'eur\' }" ng-click="$storage.currency = \'eur\'" class="btn btn-default"><div class="fa fa-fw fa-eur"></div>EUR</div><div ng-class="{ active: $storage.currency === \'gbp\' }" ng-click="$storage.currency = \'gbp\'" class="btn btn-default"><div class="fa fa-fw fa-gbp"></div>GBP</div><div ng-class="{ active: $storage.currency === \'usd\' }" ng-click="$storage.currency = \'usd\'" class="btn btn-default"><div class="fa fa-fw fa-usd"></div>USD</div></div><h1 class="lead">Balance:<div ng-class="$storage.currency | icon" class="fa fa-fw"></div>{{ $storage.balance | currency: $storage.currency }}</h1><form name="form" novalidate="novalidate"><div class="row"><div class="col-xs-6"><div ng-class="form.depositAmount.$error.float ? \'has-error\' : \'\'" class="form-group"><div class="input-group"><div class="input-group-addon"><div ng-class="$storage.currency | icon" class="fa fa-fw"></div></div><input type="text" smart-float="smart-float" name="depositAmount" ng-model="depositAmount" placeholder="Deposit" ng-keydown="inputKeydown($event, deposit)" class="form-control"><div ng-click="deposit()" class="btn input-group-addon"><div class="fa fa-plus text-success"></div></div></div></div></div><div class="col-xs-6"><div ng-class="(form.withdrawAmount.$error.float || form.withdrawAmount.$error.overdraft) ? \'has-error\' : \'\'" class="form-group"><div class="input-group"><div class="input-group-addon"><div ng-class="$storage.currency | icon" class="fa fa-fw"></div></div><input type="text" smart-float="smart-float" no-overdraft="no-overdraft" name="withdrawAmount" ng-model="withdrawAmount" placeholder="Withdraw" ng-keydown="inputKeydown($event, withdraw)" class="form-control"><div ng-click="withdraw()" class="btn input-group-addon"><div class="fa fa-minus text-danger"></div></div></div></div></div></div></form><transaction-list></transaction-list></div>')}])}();