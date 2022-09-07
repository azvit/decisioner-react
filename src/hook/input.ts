import { ChangeEvent, useState } from "react";

export const useInput = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);
    
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }

    return {
        value,
        onChange
    }
}

export const useTextArea = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);
    
    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    }

    return {
        value,
        onChange
    }
}

export const useSelect = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);
    
    const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setValue(event.target.value);
    }

    return {
        value,
        onChange
    }
}