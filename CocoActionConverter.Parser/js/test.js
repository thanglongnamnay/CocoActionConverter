iconPileChip.runAction(cc.moveBy(0.3, 0, 20));
        iconPileChip.runAction(cc.sequence([
            cc.rotateBy(0.15, 5),
            cc.rotateBy(0.15, -5),
        ]).repeatForever());