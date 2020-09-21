import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as MemoriesServer from '../lib/memories-server-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MemoriesServer.MemoriesServerStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
