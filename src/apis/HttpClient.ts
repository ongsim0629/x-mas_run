export const GET = async ({ path }: { path: string }) => {
  return fetch(`${import.meta.env.VITE_DEV_SERVER_URL}/${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    // credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) throw Error(res.status.toString());
      const result = await res.json();
      return result;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const POST = async ({ path, body }: { path: string; body?: any }) => {
  return fetch(`${import.meta.env.VITE_DEV_SERVER_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    // credentials: 'include',
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) throw Error(res.status.toString());
      const result = await res.json();
      return result;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const DELETE = async ({ path, body }: { path: string; body?: any }) => {
  return fetch(`${import.meta.env.VITE_DEV_SERVER_URL}/${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    // credentials: 'include',
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) throw Error(res.status.toString());
      const result = await res.json();
      return result;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const PUT = async ({ path, body }: { path: string; body?: any }) => {
  return fetch(`${import.meta.env.VITE_DEV_SERVER_URL}/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    // credentials: 'include',
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) throw Error(res.status.toString());
      const result = await res.json();
      return result;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};
