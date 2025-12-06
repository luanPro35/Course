-- Migration to update thumbnail_url column to support large base64 images
-- Date: 2025-11-25

ALTER TABLE courses MODIFY COLUMN thumbnail_url LONGTEXT;
