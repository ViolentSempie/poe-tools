import * as React from 'react';
import { createRoot } from 'react-dom/client';
import RootLayout from './layout';

const root = createRoot(document.getElementById("root")!);
root.render(<RootLayout />);