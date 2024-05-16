// pages/api/proxy.js

import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const targetUrl = 'https://everynoise.com/research.cgi?mode=radio&name=spotify%3Atrack%3A3zEN0ii6s4DHHBpnTp3RP7';
  
    try {
      const response = await fetch(targetUrl, {});
      const data = await response.text();
      const token = data.match(/var apiheader = \"(.+)\";/)
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'No se pudo obtener el token' }), {status: 400});
      }
      return new NextResponse(JSON.stringify(token[1]), {status: 200, headers: {"Content-Type": "application/json"}})
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return new NextResponse(JSON.stringify({ error: 'Error al realizar la solicitud' }), {status: 400});
    }
  }