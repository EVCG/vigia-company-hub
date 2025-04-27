export async function sendResetCode(email: string) {
    const response = await fetch('http://localhost:3001/api/send-reset-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao enviar código de redefinição.');
    }
  
    return await response.json();
  }
  