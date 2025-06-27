import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AlertDemo from '../components/AlertDemo';

export default function AlertDemoScreen() {
  return (
    <>
      <AlertDemo />
      <StatusBar style="auto" />
    </>
  );
}
