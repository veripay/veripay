import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);

  useEffect(() => {
    client.models.Event.observeQuery().subscribe({
      next: (data) => setEvents([...data.items]),
    });
  }, []);

  function createEvent(name: string, type: string, start: Date, end: Date, payment: number, lat: number, long: number) {
    client.models.Event.create({
      name,
      type,
      start: start.toISOString(),
      end: end.toISOString(),
      payment,
      location: { lat, long }
    });
  }

  function deleteEvent(id: any) {
    if (id && typeof id === "string") {
      client.models.Event.delete({ id });
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}</h1>

          <ul>
            {events.map((event) => (
              <li key={event.id}>
                {JSON.stringify(event)}
                <button onClick={() => deleteEvent(event.id)}>-</button>
              </li>
            ))}
          </ul>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            createEvent(
              formData.get('name') as string,
              formData.get('type') as string,
              new Date(formData.get('start') as string),
              new Date(formData.get('end') as string),
              Number(formData.get('payment')),
              Number(formData.get('lat')),
              Number(formData.get('long'))
            );
            (e.target as HTMLFormElement).reset();
          }}>
            <input name="name" type="text" placeholder="Event Name" required />
            <input name="type" type="text" placeholder="Event Type" required />
            <input name="start" type="datetime-local" required />
            <input name="end" type="datetime-local" required />
            <input name="payment" type="number" step="0.01" placeholder="Payment" required />
            <input name="lat" type="number" step="any" placeholder="Latitude" required />
            <input name="long" type="number" step="any" placeholder="Longitude" required />
            <button type="submit">Create Event</button>
          </form>

          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
