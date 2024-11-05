// src/components/Home.tsx
import { useEffect, useState } from 'react';

type Data = {
  p1: string
  p2: string
  p3: string
}

export default function Home() {

  const [data, setData] = useState<Data | null>(null)
  useEffect(() => {
    fetch('http://localhost:3333/Parametros/Master/123')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  if (!data) return <div>Loading data.....waiting</div>

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of the application.</p>
      <p>
          {data?.p1} {data?.p2} {data?.p3}
        </p>
    </div>
  );
}
