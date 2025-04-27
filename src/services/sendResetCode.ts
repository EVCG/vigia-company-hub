export async function sendResetCode(email: string) {
  try {
    const response = await fetch('http://localhost:3001/api/send-reset-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao enviar código de redefinição.');
    }

    const data = await response.json();
    return data;
    
  } catch (error: any) {
    console.error('Erro no envio do código:', error);
    throw new Error(error?.message || 'Erro inesperado na comunicação com o servidor.');
  }
}
