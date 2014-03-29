function sinaDefer () {
    function _pipe(original, deferred, callback, actionType) {
        return function () {
            if (typeof callback === 'function') {
                try {
                    var returnValue = callback.apply(original, arguments);

                    if (Deferred.isPromise(returnValue)) {
                        returnValue.then(
                            function () {
                                deferred.resolve.apply(deferred, arguments);
                            },
                            function () {
                                deferred.reject.apply(deferred, arguments);
                            }
                        );
                    }
                    else {
                        deferred.resolve.call(deferred, returnValue);
                    }
                }
                catch (e) {
                    deferred.reject(e);
                }
            }
            // `.then()`及`.then(done, null)`时使用
            // 直接使用原`Deferred`保存的参数将`deferred`改为对应状态
            else {
                deferred[actionType].apply(deferred, original._args);
            }
        };
    }
    //判断promise状态决定指定回调方法
    function _flush(deferred) {
        if (deferred._state === 'pending') {
            return;
        }
        var callbacks = deferred._state === 'resolved' ? deferred._resolves.slice() : deferred._rejects.slice();

        setTimeout(function () {
            callbacks.forEach(function (callback) {
                try {
                    callback.apply(deferred, deferred._args);
                } catch (e) {
                }
            });
        }, 0);

        deferred._resolves = [];
        deferred._rejects = [];
    }

    /**
     * @constructor
     * @class Prossmise的一个实现
     * @memberOf sinaadToolkit
     */
    function Deferred() {
        this._state = 'pending'; //当前promise状态
        this._args = null;       //传递参数
        this._resolves = [];     //成功回调集合
        this._rejects = [];      //失败回调集合
    }
    
    Deferred.prototype = /** @lends Deferred.prototype */{
        /**
         * @method
         */
        resolve : function () {
            if (this._state !== "pending") {
                return;
            }

            this._state = 'resolved';
            this._args = [].slice.call(arguments);

            _flush(this);
        },
        reject : function () {
            if (this._state !== 'pending') {
                return;
            }
            this._state = 'rejected';
            this._args = [].slice.call(arguments);

            _flush(this);
        },
        then : function (resolve, reject) {
            var deferred = new Deferred();
            
            this._resolves.push(_pipe(this, deferred, resolve, 'resolve'));
            this._rejects.push(_pipe(this, deferred, reject, 'reject'));

            _flush(this);

            return deferred;
        },
        done : function (callback) {
            return this.then(callback);
        },
        fail : function (callback) {
            return this.then(null, callback);
        }
    };

    Deferred.isPromise = function (value) {
        return value && typeof value.then === 'function';
    };

    return Deferred;
}

function testDefer () {
    var d = new (sinaDefer());
    // var d = sinaDefer(function (resovle, reject) {
    //     setTimeout(function () {
    //         resovle('little test')
    //     }, 20);
    // });
    d.then(function (x) {
        console.log('then -' + x);
        // throw {message: 'sssss'}
        return 59;
    }, function () {

    }).then(function (x) {
        console.log('then2 --' + x);
        return 72;
    },function (x) {
        console.log('reject');
    });
    d.resolve(1);
    d.then(function (x) {
        console.log('then --' + x)
    }, function (error) {
        console.log('reject --' + error.message);
        return defer(function (resovle, reject) {
            setTimeout(function () {
                console.log('loading......');
            });
        })
    });

    var promise = new Promise(function (resovle) {
        console.log();
        setTimeout(function() {
            resovle(1);
        }, 0);
    });
    promise.then(function (x) {
        console.log('then -' + x);
        return 3;
    }).then(function (x) {
        console.log('then2 -' + x);
        return 12;
    });
    promise.then(function (x) {
        console.log('then --- ' + x);
        return 4;
    });
}

testDefer();