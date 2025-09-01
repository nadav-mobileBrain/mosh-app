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
      </div>
   );
}

export default App;
