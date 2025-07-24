import * as React from 'react';

import { Button, type ButtonProps } from "./ui/button";

const RemoveButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        return <Button ref={ref} variant="destructive" {...props} />;    
    }
);
RemoveButton.displayName = "RemoveButton";


const ContactButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        return <Button ref={ref} variant="secondary" {...props} />;    
    }
);
ContactButton.displayName = "ContactButton";

const DetailsButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        return <Button ref={ref} variant="default" {...props} />;    
    }
);
DetailsButton.displayName = "DetailsButton";


const WarningButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        return <Button ref={ref} variant="warning" {...props} />;    
    }
);
WarningButton.displayName = "WarningButton";

export { RemoveButton, ContactButton, DetailsButton, WarningButton };

