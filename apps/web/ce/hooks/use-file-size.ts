/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

type TReturnProps = {
  maxFileSize: number;
};

// No file size restriction - set to 500MB
const UNLIMITED_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export const useFileSize = (): TReturnProps => ({
  maxFileSize: UNLIMITED_FILE_SIZE,
});
