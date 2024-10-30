'use client';

import { OpenAPI } from '@/tallulah-ts-client';
import { useEffect } from 'react';

const OpenAPIInitializer = () => {
  useEffect(() => {
    OpenAPI.BASE = process.env.NEXT_PUBLIC_BASE_URL || '';
  }, []);
  return null;
};

export default OpenAPIInitializer;
