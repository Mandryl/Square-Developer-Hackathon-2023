const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const logger = require("./logger");

class BasicAuth {
    constructor(id, pass) {
        this.passport = passport;
        const authMethod = (username, input, done) => {
            if (id && pass) {
                if (id === username && pass === input) {
                    done(null, { user: username });
                } else {
                    logger.error(`invalid input : [ID:${username}, pass:${input}]`);
                    done(null, false, { message: "invalid user or pass" });
                }
            } else {
                logger.error(`config error: [ID:${id}, pass:${pass}]`);
                done(new Error("server configuration error"));
            }
        };
        const strategy = new BasicStrategy(authMethod);
        this.passport.use(strategy);
        this.passport.initialize();
    }

    initialize(){
        return this.passport.initialize();
    }

    authenticate(){
        return this.passport.authenticate("basic", { session: false });
    }

}

module.exports = BasicAuth;
