---
name: implementation-planner
description: リポジトリを読み、具体的な実装計画（変更ファイル案・手順・リスク・テスト）を作成する。ユーザーが「どう実装する？」や「実装計画を出して」と依頼したときに使う。
allowed-tools: Read, Grep, Glob, Bash(git:*), Bash(rg:*)
argument-hint: "[機能/タスク]（任意: 制約）"
---

# Implementation Planner（実装計画作成）

## ミッション
ユーザーの指示をもとに、プロジェクト内の関連コードを特定して参照し、具体的で実行可能な実装計画を作成する。
計画の根拠として、参照したファイルや箇所（関数・クラス・設定など）を明示する。

## 原則
- **原則 read-only**：この Skill ではファイル編集は行わない（計画作成に徹する）。
- **段階的開示（progressive disclosure）**：最初は最小限の探索・読取りで進め、必要になったら段階的に読む範囲を広げる。
- **根拠重視**：重要な判断は、リポジトリ上の事実（既存の実装パターン、設定、呼び出し関係）に基づける。

## ワークフロー
1. ユーザー指示を整理して再定義する  
   - ゴール / 非ゴール（やらないこと）/ 受け入れ条件（Acceptance Criteria）を短く書く  
   - 本当に判断不能な場合のみ、最小限の質問をする
2. コードベースの探索（scout）  
   - `rg` / `git grep` でエントリポイント、関連モジュール、設定、テストを絞り込む  
   - 既存の規約・パターン（命名、責務分割、バリデーション、例外処理）を優先する
3. 必要箇所だけ読む（selective reading）  
   - インターフェース、主要な呼び出し元/先、バリデーション、データモデル、設定を中心に  
   - 全ファイルを丸ごと読むのは避け、必要箇所に限定する
4. テンプレートに沿って実装計画を書く  
   - `references/plan-template.md` を読み込み、そこへ埋める形で出力する
5. リスクとテストを確認する  
   - `references/risk-test-checklist.md` を読み込み、漏れがないかチェックする
6. 出力  
   - 1つの「実装計画ドキュメント」としてまとめる  
   - 「変更ファイル一覧」と「ステップ順の手順」を必ず含める

## 必要に応じて読む追加リソース
- 計画の出力テンプレ： [references/plan-template.md](references/plan-template.md)
- リポジトリ読取りの作法： [references/repo-reading-playbook.md](references/repo-reading-playbook.md)
- リスク & テストのチェックリスト： [references/risk-test-checklist.md](references/risk-test-checklist.md)

## 任意の補助ツール
- 候補ファイルを素早く列挙したい場合： `bash scripts/scout.sh "<キーワード>"`
- 構造をざっくり把握したい場合： `python scripts/summarize_tree.py .`