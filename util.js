'use strict';

export default {
    maybe: maybe,
    maybeNot: maybeNot
};

/*
    impelementation of maybe monad - do action if item is not null
    item is passed into action callback
*/
function maybe(item, action) {
    if(!item) {
        return;
    }
    return action(item);
}

/*
    variation of maybe monad - do action only if item is null
*/
function maybeNot(item, action) {
    if(item) {
        return;
    }
    return action();
}
