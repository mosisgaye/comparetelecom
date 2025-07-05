import React from 'react';
import Link from 'next/link';
import { Search, Smartphone, Wifi, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const navigation = {
    offres: [
      { name: 'Forfaits Mobile', href: '/forfait-mobile' },
      { name: 'Box Internet', href: '/box-internet' },
    ],
    company: [
      { name: 'À propos', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Mentions légales', href: '/legal' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'CGU', href: '/terms' },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CompareTelecom</span>
            </Link>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Le comparateur n°1 en France pour trouver les meilleures offres mobiles et box internet. 
              Gratuit, fiable et mis à jour quotidiennement.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contact@comparetelecom.fr</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos offres</h3>
            <ul className="space-y-3">
              {navigation.offres.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {item.name === 'Forfaits Mobile' && <Smartphone className="w-4 h-4" />}
                    {item.name === 'Box Internet' && <Wifi className="w-4 h-4" />}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 CompareTelecom. Tous droits réservés.
            </p>
            
            <div className="flex items-center gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}