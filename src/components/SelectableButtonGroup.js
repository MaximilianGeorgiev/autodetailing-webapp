import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export const SelectableButtonGroup = (props) => {
    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);

        // manipulate state of parent component
        if (props.toggleSelect) props.toggleSelect((old) => !old);
    };

    return (
        <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
        >
            <ToggleButton value="web">{props.firstOption ? props.firstOption : ""}</ToggleButton>
            <ToggleButton value="android">{props.secondOption ? props.secondOption : ""}</ToggleButton>
        </ToggleButtonGroup>
    );
}
