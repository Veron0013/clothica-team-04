// components/MessageNoInfo/MessageNoInfo.tsx

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import style from './MessageNoInfo.module.css';

interface MessageNoInfoProps {
  text: string;
  buttonText: string;
  route?: string; // '/goods' | '/categories'
}

export default function MessageNoInfo({
    text,
    buttonText,
    route = '/goods' })
{
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div className={styles['message-container']}>
      <p className={styles['message-text']}>{text}</p>
      <button onClick={handleClick} className={styles['message-button']}>
        {buttonText}
      </button>
    </div>
  );
}