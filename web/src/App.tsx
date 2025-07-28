import React from 'react';
import { Button } from './components/ui/button';


export default function App() {
  return (
    <div>
      <Button variant="destructive">Remove</Button>
      <Button variant="secondary">Contact</Button>
      <Button variant="default">Details</Button>
      <Button variant="warning">Warning</Button>
    </div>
  );
}


