export const shouldStepUpdate = ( stepData: any, formData: any ) => {
    const stepDataKeys = Object.keys( stepData );
    const formDataKeys = Object.keys( formData );
    if ( stepDataKeys.length !== formDataKeys.length ) {
        return true;
    }
    for ( let key of stepDataKeys ) {
        if ( stepData[key] !== formData[key] ) {
            return true;
        }
    }

    return false;
}