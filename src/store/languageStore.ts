import { create } from 'zustand'

type Language = 'en' | 'ja'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
  translations: {
    [key in Language]: {
      appTitle: string
      createFlyer: string
      selectTemplate: string
      enterPrompt: string
      generateFlyer: string
      imageSearch: string
      customizeText: string
      downloadFlyer: string
      templateTitle: string
      businessTemplate: string
      eventTemplate: string
      promotionTemplate: string
      languageSelector: string
      placeholderText: string
      uploadImage: string
      textColor: string
      backgroundColor: string
      fontFamily: string
      fontSelector: string
      imagePositionTitle: string
      saveTemplate: string
      preview: string
      search: string
      searchImages: string
      uploadImages: string
      uploadImagesDescription: string
      uploadedImages: string
      clickToSelectMain: string
      clickPlusToAddLayer: string
      imageLayers: string
      textLayers: string
      layer: string
      opacity: string
      width: string
      height: string
      position: string
      pageSize: string
      style: string
      currentDimensions: string
      dragModeEnabled: string
      enableDragMode: string
      disableDragMode: string
      dragToPosition: string
      fontSize: string
      text: string
      bold: string
      italic: string
      rotation: string
      moveUp: string
      moveDown: string
      remove: string
      addTextLayer: string
      noTextLayers: string
      backgroundSettings: string
      backgroundImage: string
      useSelectedImage: string
      backgroundStyle: string
      imageFilter: string
      filterNone: string
      filterGrayscale: string
      filterSepia: string
      filterVintage: string
      filterBlur: string
      filterContrast: string
      filterBright: string
      filterDark: string
      filterWarm: string
      filterCool: string
      images: string
      background: string
      settings: string
      bgStyleCover: string
      bgStyleContain: string
      bgStyleStretch: string
      bgStyleRepeat: string
      bgStylePattern: string
      bgStyleOverlay: string
      toggleLayerBorders: string
    }
  }
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ja',
  setLanguage: (language: Language) => set({ language }),
  translations: {
    en: {
      appTitle: 'Flyer Ad Generator',
      createFlyer: 'Create Your Flyer',
      selectTemplate: 'Select Template',
      enterPrompt: 'Enter your prompt',
      generateFlyer: 'Generate Flyer',
      imageSearch: 'Image Library',
      customizeText: 'Customize Text',
      downloadFlyer: 'Download Flyer',
      templateTitle: 'Choose a Template',
      businessTemplate: 'Business Flyer',
      eventTemplate: 'Event Flyer',
      promotionTemplate: 'Promotion Flyer',
      languageSelector: 'Language',
      placeholderText: 'Enter your flyer text here...',
      uploadImage: 'Upload Image',
      textColor: 'Text Color',
      backgroundColor: 'Background Color',
      fontFamily: 'Font Style',
      fontSelector: 'Font Style',
      imagePositionTitle: 'Image Position',
      saveTemplate: 'Save Template',
      preview: 'Preview',
      search: 'Search',
      searchImages: 'Search Images',
      uploadImages: 'Upload Images',
      uploadImagesDescription: 'Upload JPG, PNG, or GIF images from your computer',
      uploadedImages: 'Uploaded Images',
      clickToSelectMain: 'Click image to select as main',
      clickPlusToAddLayer: 'Click + to add as a layer',
      imageLayers: 'Image Layers',
      textLayers: 'Text Layers',
      layer: 'Layer',
      opacity: 'Opacity',
      width: 'Width',
      height: 'Height',
      position: 'Position',
      pageSize: 'Page Size',
      style: 'Style',
      currentDimensions: 'Current dimensions',
      dragModeEnabled: 'Drag Mode Enabled',
      enableDragMode: 'Enable drag mode',
      disableDragMode: 'Disable drag mode',
      dragToPosition: 'Drag to position',
      fontSize: 'Font Size',
      text: 'Text',
      bold: 'Bold',
      italic: 'Italic',
      rotation: 'Rotation',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      remove: 'Remove',
      addTextLayer: 'Add Text Layer',
      noTextLayers: 'No text layers. Click Add Text to create a layer.',
      backgroundSettings: 'Background Settings',
      backgroundImage: 'Background Image',
      useSelectedImage: 'Use Selected Image',
      backgroundStyle: 'Display Style',
      imageFilter: 'Image Filter',
      filterNone: 'None',
      filterGrayscale: 'Grayscale',
      filterSepia: 'Sepia',
      filterVintage: 'Vintage',
      filterBlur: 'Blur',
      filterContrast: 'High Contrast',
      filterBright: 'Brighten',
      filterDark: 'Darken',
      filterWarm: 'Warm',
      filterCool: 'Cool',
      images: 'Images',
      background: 'Background',
      settings: 'Settings',
      bgStyleCover: 'Cover (Fill)',
      bgStyleContain: 'Contain (Fit)',
      bgStyleStretch: 'Stretch',
      bgStyleRepeat: 'Repeat',
      bgStylePattern: 'Pattern',
      bgStyleOverlay: 'Overlay',
      toggleLayerBorders: 'Toggle layer borders'
    },
    ja: {
      appTitle: 'チラシ広告ジェネレーター',
      createFlyer: 'チラシを作成',
      selectTemplate: 'テンプレートを選択',
      enterPrompt: 'プロンプトを入力',
      generateFlyer: 'チラシを生成',
      imageSearch: '画像ライブラリ',
      customizeText: 'テキストをカスタマイズ',
      downloadFlyer: 'チラシをダウンロード',
      templateTitle: 'テンプレートを選択',
      businessTemplate: 'ビジネスチラシ',
      eventTemplate: 'イベントチラシ',
      promotionTemplate: 'プロモーションチラシ',
      languageSelector: '言語',
      placeholderText: 'チラシのテキストをここに入力...',
      uploadImage: '画像をアップロード',
      textColor: 'テキストの色',
      backgroundColor: '背景色',
      fontFamily: 'フォントスタイル',
      fontSelector: 'フォントスタイル',
      imagePositionTitle: '画像の位置',
      saveTemplate: 'テンプレートを保存',
      preview: 'プレビュー',
      search: '検索',
      searchImages: '画像を検索',
      uploadImages: '画像をアップロード',
      uploadImagesDescription: 'コンピュータからJPG、PNG、GIF画像をアップロード',
      uploadedImages: 'アップロード済み画像',
      clickToSelectMain: '画像をクリックして主な画像として選択',
      clickPlusToAddLayer: '+をクリックしてレイヤーとして追加',
      imageLayers: '画像レイヤー',
      textLayers: 'テキストレイヤー',
      layer: 'レイヤー',
      opacity: '透明度',
      width: '幅',
      height: '高さ',
      position: '位置',
      pageSize: 'ページサイズ',
      style: 'スタイル',
      currentDimensions: '現在のサイズ',
      dragModeEnabled: 'ドラッグモード有効',
      enableDragMode: 'ドラッグモードを有効にする',
      disableDragMode: 'ドラッグモードを無効にする',
      dragToPosition: 'ドラッグして配置',
      fontSize: 'フォントサイズ',
      text: 'テキスト',
      bold: '太字',
      italic: '斜体',
      rotation: '回転',
      moveUp: '上へ移動',
      moveDown: '下へ移動',
      remove: '削除',
      addTextLayer: 'テキストレイヤーを追加',
      noTextLayers: 'テキストレイヤーがありません。「テキストレイヤーを追加」をクリックしてレイヤーを作成してください。',
      backgroundSettings: '背景設定',
      backgroundImage: '背景画像',
      useSelectedImage: '選択した画像を使用',
      backgroundStyle: '表示スタイル',
      imageFilter: '画像フィルター',
      filterNone: 'なし',
      filterGrayscale: 'グレースケール',
      filterSepia: 'セピア',
      filterVintage: 'ビンテージ',
      filterBlur: 'ぼかし',
      filterContrast: '高コントラスト',
      filterBright: '明るく',
      filterDark: '暗く',
      filterWarm: '暖色',
      filterCool: '寒色',
      images: '画像',
      background: '背景',
      settings: '設定',
      bgStyleCover: 'カバー（埋める）',
      bgStyleContain: 'コンテイン（収める）',
      bgStyleStretch: 'ストレッチ（引き伸ばす）',
      bgStyleRepeat: 'リピート（繰り返し）',
      bgStylePattern: 'パターン',
      bgStyleOverlay: 'オーバーレイ（重ね合わせ）',
      toggleLayerBorders: 'レイヤーの枠を表示/非表示'
    }
  }
}))