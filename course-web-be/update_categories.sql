-- Update existing category data to match new uppercase enum values
UPDATE categories SET slug = 'CPP' WHERE slug = 'cpp';
UPDATE categories SET slug = 'DEVOPS' WHERE slug = 'devops';
UPDATE categories SET slug = 'JAVASCRIPT' WHERE slug = 'javascript';
UPDATE categories SET slug = 'PYTHON' WHERE slug = 'python';
UPDATE categories SET slug = 'REACT_NATIVE' WHERE slug = 'react_native';