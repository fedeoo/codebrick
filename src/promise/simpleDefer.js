//超简单版
//与标准不一致 d.then().then() 与d.then() d.then()不同
function defer (func) {
    var observers = [];
    var state = 0;
    function then (onFulfill, onError) {
        if (observers) {
            observers.push([onFulfill, onError]);
        } else {
            observers = [];
            observers.push([onFulfill, onError]);
            exec();
        }
        return this;
    }
    function exec (result) {
        while (observers.length) {
            var observer = observers.shift();
            if (typeof observer[state] !== 'function') {
                continue;
            }
            try {
                result = observer[state](result);
                if (result && typeof (result.then) === 'function') {//返回的是defer
                    return result.then(resolve, reject);
                }
            } catch (e) {
                state = 1;
                result = e;
            }
        }
        observers = null;
    }
    function resovle (x) {
        state = 0;
        exec(x);
    }
    function reject (x) {
        state = 1;
        exec(x);
    }
    func(resovle, reject);
    return {
        then: then
        // resolve: resolve
        // reject: reject
    }
}

function testDefer () {
    var d = defer(function (resovle, reject) {
        setTimeout(function () {
            resovle('little test')
        }, 20);
    });
    d.then(function (x) {
        console.log('then -' + x);
        throw {message: 'sssss'}
    }, function () {

    });
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
}
testDefer();