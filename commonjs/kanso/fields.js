var validators = require('./validators');


var Field = exports.Field = function (options) {
    options = options || {};

    this.required = ('required' in options) ? options.required: true;
    this.validators = ('validators' in options) ? options.validators: [];
    this.parse = options.parse || function (raw) {
        return raw;
    };
};

Field.prototype.validate = function (doc, value) {
    if (value === '' || value === null || value === undefined) {
        // don't validate empty fields, but check if required
        if (this.required) {
            throw new Error('required field');
        }
    }
    else {
        for (var i = 0; i < this.validators.length; i += 1) {
            this.validators[i](doc, value);
        }
    }
};


exports.string = function (options) {
    options = options || {};

    options.parse = function (raw) {
        return '' + raw;
    };
    return new Field(options);
};


exports.number = function (options) {
    options = options || {};

    options.parse = function (raw) {
        if (raw === null || raw === '') {
            return NaN;
        }
        return Number(raw);
    };
    if (!options.validators) {
        options.validators = [];
    }
    options.validators.unshift(function (doc, value) {
        if (isNaN(value)) {
            throw new Error('Not a number');
        }
    });
    return new Field(options);
};


exports.boolean = function (options) {
    options = options || {};

    options.parse = function (raw) {
        return Boolean(raw);
    };
    return new Field(options);
};


exports.url = function (options) {
    options = options || {};

    if (!options.validators) {
        options.validators = [];
    }
    options.validators.unshift(validators.url());
    return exports.string(options);
};


exports.email = function (options) {
    options = options || {};

    if (!options.validators) {
        options.validators = [];
    }
    options.validators.unshift(validators.email());
    return exports.string(options);
};
