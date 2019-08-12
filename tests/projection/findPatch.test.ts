import { findPatch } from '../../src/projection/findPatch';

describe('findPatch()', () => {
  describe('Given a sequence number corresponding to a patch in the list', () => {
    it('Should return the patch', () => {
      const patchSequence = 3;

      const patch = findPatch(
        // @ts-ignore
        [{ sequence: 1 }, { sequence: 2 }, { sequence: 3 }, { sequence: 4 }],
        patchSequence,
      );

      expect(patch.sequence).toStrictEqual(3);
    });
  });

  describe('Given a sequence number NOT corresponding to a patch in the list', () => {
    it('Should return the patch', () => {
      const patchSequence = 5;
      let error;

      try {
        const patch = findPatch(
          // @ts-ignore
          [{ sequence: 1 }, { sequence: 2 }, { sequence: 3 }, { sequence: 4 }],
          patchSequence,
        );
      } catch (err) {
        error = err;
      }

      expect(error.message).toStrictEqual('Patch not found');
      expect(error.code).toStrictEqual('PATCH_NOT_FOUND');
    });
  });
});
