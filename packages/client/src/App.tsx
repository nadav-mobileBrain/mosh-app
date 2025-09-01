import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';

function App() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => setMessage(data.message));
   }, []);

   return (
      <div className="p-4">
         <p className="p-4 text-4xl text-center font-bold underline">
            {message}
         </p>
         <Button>Click me</Button>
         <Button variant="destructive">Click me</Button>
         <Button variant="outline">Click me</Button>
         <Button variant="secondary">Click me</Button>
         <Button variant="ghost">Click me</Button>
         <Button variant="link">Click me</Button>
      </div>
   );
}

export default App;
