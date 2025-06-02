#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
散乱角計算プログラム
ガラスセル、コイル、検出器の配置から散乱角と検出幅を計算・可視化します。
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

# 日本語フォントの設定
plt.rcParams['font.family'] = 'Hiragino Sans'  # macOSの標準日本語フォント
mpl.rcParams['axes.unicode_minus'] = False  # マイナス記号を正しく表示

class ScatteringAngleCalculator:
    def __init__(self, cell_length=80, cell_width=42, coil_length=300, coil_width=200, detector_width=256):
        """
        散乱角計算器のコンストラクタ

        Parameters:
        -----------
        cell_length : float
            ガラスセルの長さ (mm)
        cell_width : float
            ガラスセルの幅 (mm)
        coil_length : float
            コイルの長さ (mm)
        coil_width : float
            コイルの幅 (mm)
        detector_width : float
            検出器の幅 (mm)
        """
        self.cell_length = cell_length
        self.cell_width = cell_width
        self.coil_length = coil_length
        self.coil_width = coil_width
        self.detector_width = detector_width

    def calculate_angles(self, cell_position_x):
        """
        与えられたガラスセルの位置における散乱角を計算します。

        Parameters:
        -----------
        cell_position_x : float
            試料からガラスセルの中心までのX軸方向の距離 (mm)

        Returns:
        --------
        float
            散乱角（ラジアン）
        """
        # 散乱角の計算（ラジアンで返す）
        scattering_angle = np.arctan((self.cell_width/2) / (cell_position_x+self.cell_length/2))
        return scattering_angle

    def calculate_detector_width(self, cell_position_x, detector_position_x):
        """
        散乱角によって作られる検出器上の幅を計算します。

        Parameters:
        -----------
        cell_position_x : float
            試料からガラスセルの中心までのX軸方向の距離 (mm)
        detector_position_x : float
            試料から検出器までのX軸方向の距離 (mm)

        Returns:
        --------
        float
            検出器上の幅 (mm)
        """
        scattering_angle = self.calculate_angles(cell_position_x)

        # 散乱角（ラジアン）のtanを使って検出器位置でのy座標を計算
        detector_y = detector_position_x * np.tan(scattering_angle)

        # 検出器上の幅を返す（中心から片側の距離の2倍）
        return detector_y * 2

    def plot_coverage(self, cell_position_x, detector_position_x=None):
        """
        散乱角の範囲を可視化します。

        Parameters:
        -----------
        cell_position_x : float
            試料からガラスセルの中心までのX軸方向の距離 (mm)
        detector_position_x : float, optional
            試料から検出器までのX軸方向の距離 (mm)
        """
        scattering_angle = self.calculate_angles(cell_position_x)

        # プロット作成
        fig, ax = plt.subplots(figsize=(12, 8))

        # ガラスセルの範囲をプロット（x軸上の指定位置に、y≥0の部分のみ）
        rect_cell = plt.Rectangle((cell_position_x - self.cell_length/2, 0),
                            self.cell_length, self.cell_width/2,
                            fill=False, color='blue', label='ガラスセル', linewidth=1.5)
        ax.add_patch(rect_cell)

        # コイルの範囲をプロット（x軸上の指定位置に、y≥0の部分のみ）
        rect_coil = plt.Rectangle((cell_position_x - self.coil_length/2, 0),
                            self.coil_length, self.coil_width/2,
                            fill=False, color='green', label='コイル', linewidth=1.5)
        ax.add_patch(rect_coil)

        # 検出器をプロット（指定された場合）
        if detector_position_x is not None:
            detector = plt.Rectangle((detector_position_x, 0),
                                  1, self.detector_width/2,
                                  fill=True, color='red', alpha=0.3, label='検出器')
            ax.add_patch(detector)

            # 散乱角による検出器上の幅を計算
            detector_coverage = self.calculate_detector_width(cell_position_x, detector_position_x)

        # 原点から四隅への線をプロット（y≥0の部分のみ）
        corners = [
            (cell_position_x + self.cell_length/2, 0),
            (cell_position_x + self.cell_length/2, self.cell_width/2),
        ]

        # 散乱角の線を描画
        for x, y in corners:
            if detector_position_x is not None:
                # 検出器位置までの線を引く
                y_at_detector = (y / x) * detector_position_x
                if y_at_detector >= 0:  # y≥0の場合のみプロット
                    plt.plot([0, detector_position_x], [0, y_at_detector], 'k--', alpha=0.3)
            else:
                # 検出器がない場合は四隅まで
                if y >= 0:  # y≥0の場合のみプロット
                    plt.plot([0, x], [0, y], 'k--', alpha=0.3)

        # グラフの設定
        ax.set_aspect('equal')
        plt.grid(True)

        # タイトルをグラフ内部に表示
        text_content = f'散乱角: {np.degrees(scattering_angle):.1f}°'
        if detector_position_x is not None:
            text_content += f'\n検出幅: {detector_coverage:.1f}mm'

        # グラフの上部内側にテキストを配置
        plt.text(0.02, 0.98, text_content,
                transform=ax.transAxes,  # 軸に対する相対座標を使用
                verticalalignment='top',
                horizontalalignment='left',
                bbox=dict(facecolor='white', alpha=0.8, edgecolor='none'))

        plt.xlabel('X (mm)')
        plt.ylabel('Y (mm)')
        plt.legend()

        # 軸の範囲設定
        margin = 50
        max_x = max(cell_position_x + self.cell_length/2, detector_position_x if detector_position_x else 0)
        plt.xlim(-margin, max_x + margin)
        plt.ylim(0, self.detector_width/2 + margin)  # y軸は0以上のみ表示

        plt.show()

def main():
    """メイン関数"""
    # パラメータ設定
    cell_position = 200    # ガラスセルの位置 (mm)
    detector_position = 800  # 検出器の位置 (mm)

    # 計算実行
    calculator = ScatteringAngleCalculator()
    calculator.plot_coverage(cell_position, detector_position)

if __name__ == "__main__":
    main()
