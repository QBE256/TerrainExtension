/*--------------------------------------------------------------------------
　地形効果拡張スクリプト
■作成者
キュウブ

■概要
・地形効果のHP回復量を割合で指定できるようにしました(最大HPの20%回復　といった設定が可能)。
・地形効果によるHPダメージで対象キャラが致死ダメージを受けてもHPが1残る指定をできるようにしました。

■使い方
地形効果のカスパラで{rate:'<HP回復率 (%単位)>'}とする事で対象キャラがx%回復するようになります。
また、{live_flag:true}とする事で致死ダメージを受けてもHPが1残るようになります。


例1.対象ユニットに最大HPの20%分だけ回復させたい場合
{rate: '20'}

例2.対象ユニットに最大HPの60%分ダメージを与えたい場合
{rate: '-60'}

例3.対象ユニットに最大HPの20%分ダメージを与えつつ、地形ダメージで死亡させない場合
{rate: '-20', live_flag: true}

■更新履歴

■対応バージョン
SRPG Studio Version:1.098

■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK (明記する場合は"キュウブ"でお願いします)
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。

--------------------------------------------------------------------------*/

RecoveryAllFlowEntry._getRecoveryValue = function(unit) {
	var skill, terrain;
	var recoveryValue = 0;

	skill = SkillControl.getBestPossessionSkill(unit, SkillType.AUTORECOVERY);
	if (skill !== null) {
		recoveryValue += skill.getSkillValue();
	}

	terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
	if (terrain !== null) {
		recoveryValue += terrain.getAutoRecoveryValue();
		if (terrain.custom.rate) {
			recoveryValue += Math.floor(ParamBonus.getMhp(unit) * parseInt(terrain.custom.rate) / 100);
		}
	}

	recoveryValue += StateControl.getHpValue(unit);

	if (recoveryValue + unit.getHp() < 0 && terrain.custom.live_flag === true) {
		recoveryValue = 1 - unit.getHp();
	}

	return recoveryValue;
};