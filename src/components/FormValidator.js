const Valid = { error: false, message: "" }

class FormValidator {
    constructor(rules) {
        this.rules = rules
        this.isValid = true
    }

    validate(form) {
        let validation = {}
        this.isValid = true
        this.rules.forEach(({ name, validate }) => {
            if (validate.constructor !== Array) validate = [validate]

            validate.forEach(vf => {
                let message = vf(name, form[name])

                if (message) {
                    validation[name] = { error: true, message }
                    this.isValid = false
                } else {
                    validation[name] = { ...Valid }
                }
            })
        })

        return validation
    }

    valid(form) {
        let validation = {}
        for (let key in form) {
            validation[key] = { ...Valid }
        }
        return validation
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const required = (name, value) =>
    value ? "" : capitalizeFirstLetter(name) + " is required"
export const email = (name, value) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(value) ? "" : "Enter a valid email "
}

export default FormValidator
