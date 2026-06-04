export class FlowFieldManager {
    constructor(fields, initialFieldName) {
        this.fields = fields;
        this.fieldNames = Object.keys(fields);
        this.activeFieldName = initialFieldName || this.fieldNames[0];
    }

    sample(x, y) {
        return this.fields[this.activeFieldName].sample(x, y);
    }

    getActiveFieldName() {
        return this.activeFieldName;
    }

    setActiveField(name) {
        if (this.fields[name]) {
            this.activeFieldName = name;
        }
    }

    nextField() {
        if (this.fieldNames.length === 0) {
            return;
        }

        const index = this.fieldNames.indexOf(this.activeFieldName);
        const nextIndex = (index + 1) % this.fieldNames.length;
        this.activeFieldName = this.fieldNames[nextIndex];
    }
}