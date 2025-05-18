import { hash, compare } from 'bcrypt';

export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>;
}

export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>;
}

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
