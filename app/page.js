"use client";

import { useState, useRef } from "react";
import JSEncrypt from "jsencrypt";
import "./globals.css";

export default function Home() {
  const [isKeySectionVisible, setIsKeySectionVisible] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [otherPublicKey, setOtherPublicKey] = useState("");

  // Refs for textareas
  const otherPublicKeyRef = useRef(null);
  const cipherTextRef = useRef(null);
  const plainTextRef = useRef(null);
  const decryptedTextRef = useRef(null);

  const toggleKeySection = () => {
    setIsKeySectionVisible(!isKeySectionVisible);
  };

  const generateKeys = () => {
    const crypt = new JSEncrypt();
    setPublicKey(crypt.getPublicKey());
    setPrivateKey(crypt.getPrivateKey());
  };

  const encryptText = () => {
    if (!otherPublicKey || !plainText) {
      alert("請填寫對方公鑰和己方明文！");
      return;
    }
    const crypt = new JSEncrypt();
    crypt.setPublicKey(otherPublicKey);
    const encrypted = crypt.encrypt(plainText);
    if (encrypted) {
      setCipherText(encrypted);
    } else {
      alert("加密失敗，請確認公鑰正確！");
    }
  };

  const decryptText = () => {
    if (!privateKey || !cipherText) {
      alert("請填寫己方私鑰和對方密文！");
      return;
    }
    const crypt = new JSEncrypt();
    crypt.setPrivateKey(privateKey);
    const decrypted = crypt.decrypt(cipherText);
    if (decrypted) {
      setDecryptedText(decrypted);
    } else {
      alert("解密失敗，請確認密文和私鑰正確！");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("複製成功！");
      })
      .catch((error) => {
        console.error("複製失敗", error);
      });
  };

  const pasteToTextarea = (textareaRef, setValue) => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (textareaRef.current) {
          textareaRef.current.value = text;
          setValue(text);
        }
      })
      .catch((error) => {
        console.error("粘貼失敗", error);
      });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div>
        <button
          className="text-white bg-gray-700 p-2 w-full text-left flex justify-between items-center"
          onClick={toggleKeySection}
        >
          生成公私鑰{" "}
          <span
            className={`transform ${
              isKeySectionVisible ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>
        {isKeySectionVisible && (
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                onClick={generateKeys}
              >
                生成
              </button>
            </div>
            <div className="flex flex-col">
              <label className="text-white">己方公鑰</label>
              <div className="flex">
                <textarea
                  className="resize-none border p-2 flex-1"
                  readOnly
                  value={publicKey}
                />
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                  onClick={() => copyToClipboard(publicKey)}
                >
                  複製
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-300" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-white">對方公鑰</label>
          <div className="flex">
            <textarea
              ref={otherPublicKeyRef}
              className="resize-none border p-2 flex-1"
              value={otherPublicKey}
              onChange={(e) => setOtherPublicKey(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
              onClick={() =>
                pasteToTextarea(otherPublicKeyRef, setOtherPublicKey)
              }
            >
              貼上
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-white">己方私鑰</label>
          <textarea
            className="resize-none border p-2"
            value={privateKey}
            readOnly
          />
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-white">己方明文</label>
          <textarea
            ref={plainTextRef}
            className="resize-none border p-2 h-52"
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={encryptText}
          >
            加密→
          </button>
        </div>
        <div className="flex flex-col">
          <label className="text-white">己方密文</label>
          <div className="flex">
            <textarea
              ref={cipherTextRef}
              className="resize-none border p-2 flex-1"
              value={cipherText}
              readOnly
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
              onClick={() => copyToClipboard(cipherText)}
            >
              複製
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-white">對方密文</label>
          <div className="flex">
            <textarea
              ref={cipherTextRef}
              className="resize-none border p-2 flex-1"
              value={cipherText}
              onChange={(e) => setCipherText(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
              onClick={() => pasteToTextarea(cipherTextRef, setCipherText)}
            >
              貼上
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={decryptText}
          >
            ←解密
          </button>
        </div>
        <div className="flex flex-col">
          <label className="text-white">對方明文</label>
          <textarea
            ref={decryptedTextRef}
            className="resize-none border p-2 h-52"
            value={decryptedText}
            readOnly
          />
        </div>
      </div>

      {/* 頁尾 */}
      <footer className="mt-8 text-center text-gray-500">
        <p>
          專案連結:{" "}
          <a
            href="https://github.com/YC815/ras-chat"
            className="text-blue-500 underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
