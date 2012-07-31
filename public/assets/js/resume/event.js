/**
 * Event Dispatcher
 *
 * @author  Joseph Wynn <joseph@wildlyinaccurate.com>
 */
Resume.Event = function() {

    var self = this;

    self.callStack = {};
    self.callOnceStack = {};

    self.pushOntoStack = function(stack, event, callback) {
        if (typeof stack[event] === 'undefined') {
            stack[event] = [];
        }

        stack[event].push(callback);
    }

    return {

        fire: function(event) {
            var callStack = self.callStack[event];
            var callOnceStack = self.callOnceStack[event];

            if (typeof callStack !== 'undefined') {
                var i = 0;
                var stackLength = callStack.length;

                while (i < stackLength) {
                    (callStack[i])();
                    i++;
                }
            }

            if (typeof callOnceStack !== 'undefined') {
                while (callOnceStack.length) {
                    (callOnceStack.shift())();
                }
            }
        },

        on: function(event, callback) {
            self.pushOntoStack(self.callStack, event, callback);
        },

        once: function(event, callback) {
            self.pushOntoStack(self.callOnceStack, event, callback);
        }

    };

}();
