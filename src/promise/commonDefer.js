function defer () {
    var observers = [];
    var result = null;
    function then (onFulfil, onError) {
        var deferred = new defer();
        function resolve (value) {
            var ret = onFulfil ? onFulfil(value) : value;
            deffred.resolve(ret);
            //if ret is refer
            // deferred.resolve(onFulfil ? onFulfil(value) : value);
        }
        function reject (value) {
            var ret = onError ? onError(value) : value;
            //
            deferred.reject(ret);
            // if (onError) {
            //     deferred.reject(onError(value));
            // } else {
            //     deferred.resolve(value);
            // }
        }
        if (observers === null) {
            result.then(resolve, reject);
        } else {
            observers.push({resolve: resolve, reject: reject});
        }
        return deferred;
    }

    function resolve (value) {
        if (!result) {
            result = isPromise(value) ? value : {then : function (resolve) {resolve(value);}};
            while (observers.length) {
                var observer = observers.shift();
                result.then(observer.resolve, observer.reject);
            }
            observers = null;
        }
    }
    function reject (value) {
        // result = isPromise(value) ? value : {then : function (resolve, reject) {reject(value);}};
        // while (observers.length) {
        //     var observer = observers.shift();
        //     result.then(observer.resolve, observer.reject);
        // }
        // observers = null;
        // 
        resolve({then: function (resolve, reject) {reject(value);}});
    }

    return {
        then: then,
        resolve: resolve,
        reject: reject
    };
}