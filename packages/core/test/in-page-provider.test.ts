import { assert, describe, it } from 'vitest';
import { InPageProvider } from "../src";

describe('in-page', () => {
  it('foo', () => {
    // console.log(new InPageProvider());
    assert.equal(Math.sqrt(4), 2);
  });

});
