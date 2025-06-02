# 散乱角計算プログラム

このプログラムは、ガラスセル、コイル、検出器の配置から散乱角と検出幅を計算・可視化するためのツールです。

## 機能

- ガラスセルとコイルの配置の可視化
- 散乱角の計算と表示
- 検出器上の幅の計算
- 散乱角の可視化（点線による表示）

## 必要条件

- Python 3.7以上
- NumPy
- Matplotlib

## インストール方法

1. リポジトリをクローン：
```bash
git clone [repository-url]
cd [repository-name]
```

2. 必要なパッケージをインストール：
```bash
pip install -r requirements.txt
```

## 使用方法

### 基本的な使用方法

```python
from scattering_angle_calculator import ScatteringAngleCalculator

# 計算機のインスタンスを作成
calculator = ScatteringAngleCalculator()

# パラメータ設定
cell_position = 200    # ガラスセルの位置 (mm)
detector_position = 800  # 検出器の位置 (mm)

# 計算と可視化
calculator.plot_coverage(cell_position, detector_position)
```

### パラメータのカスタマイズ

```python
calculator = ScatteringAngleCalculator(
    cell_length=80,     # ガラスセルの長さ (mm)
    cell_width=42,      # ガラスセルの幅 (mm)
    coil_length=300,    # コイルの長さ (mm)
    coil_width=200,     # コイルの幅 (mm)
    detector_width=256  # 検出器の幅 (mm)
)
```

## パラメータの説明

- `cell_length`: ガラスセルの長さ (mm) [デフォルト: 80]
- `cell_width`: ガラスセルの幅 (mm) [デフォルト: 42]
- `coil_length`: コイルの長さ (mm) [デフォルト: 300]
- `coil_width`: コイルの幅 (mm) [デフォルト: 200]
- `detector_width`: 検出器の幅 (mm) [デフォルト: 256]

## 出力例

プログラムは以下の情報を表示します：
- ガラスセルとコイルの位置（青と緑の枠）
- 散乱角（度）
- 検出器上の幅（mm）
- 散乱角の範囲（点線）