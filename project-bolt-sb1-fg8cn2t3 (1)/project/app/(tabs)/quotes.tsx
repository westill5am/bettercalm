import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, Share2, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import quotesData from '@/assets/data/quotes.json';

interface Quote {
  text: string;
  author: string;
  category: string;
}

export default function QuotesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [quotes, setQuotes] = useState<Quote[]>(quotesData);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isQuoteCopied, setIsQuoteCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  const filteredQuotes = selectedCategory 
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  useEffect(() => {
    // Reset index when category changes
    setCurrentQuoteIndex(0);
  }, [selectedCategory]);

  const currentQuote = filteredQuotes[currentQuoteIndex] || { text: '', author: '', category: '' };

  const showNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => 
      prevIndex === filteredQuotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousQuote = () => {
    setCurrentQuoteIndex((prevIndex) => 
      prevIndex === 0 ? filteredQuotes.length - 1 : prevIndex - 1
    );
  };

  const copyToClipboard = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    }
    setIsQuoteCopied(true);
    setTimeout(() => setIsQuoteCopied(false), 2000);
  };

  const shareQuote = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Share.share({
          message: `"${currentQuote.text}" - ${currentQuote.author}`,
        });
      }
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Daily Quotes</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.quoteCard, { backgroundColor: colors.card }]}>
          <View style={styles.quoteIconContainer}>
            <Text style={[styles.quoteIcon, { color: colors.primary }]}>"</Text>
          </View>
          
          <Text style={[styles.quoteText, { color: colors.text }]}>
            {currentQuote.text}
          </Text>
          
          <Text style={[styles.quoteAuthor, { color: colors.tabIconDefault }]}>
            — {currentQuote.author}
          </Text>
          
          <View style={styles.quoteActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
              onPress={copyToClipboard}
            >
              <Copy size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>
                {isQuoteCopied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
            
            {Platform.OS !== 'web' && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                onPress={shareQuote}
              >
                <Share2 size={20} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Share</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.navigation}>
          <TouchableOpacity 
            style={[styles.navButton, { backgroundColor: colors.card }]}
            onPress={showPreviousQuote}
          >
            <ChevronLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.paginationInfo}>
            <Text style={[styles.paginationText, { color: colors.text }]}>
              {currentQuoteIndex + 1} / {filteredQuotes.length}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.navButton, { backgroundColor: colors.card }]}
            onPress={showNextQuote}
          >
            <ChevronRight size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            Today's Quote
          </Text>
          <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
            Each day brings a new quote to inspire your journey. Come back tomorrow for fresh inspiration.
          </Text>
        </View>
        
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <View style={styles.categories}>
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.categoryTag,
                  { 
                    backgroundColor: selectedCategory === category ? colors.primary : colors.primary + '20',
                    borderColor: colors.primary
                  }
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text 
                  style={[
                    styles.categoryText, 
                    { color: selectedCategory === category ? '#FFFFFF' : colors.primary }
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  quoteCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteIcon: {
    fontSize: 60,
    fontFamily: 'Inter-Bold',
    lineHeight: 60,
  },
  quoteText: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 24,
  },
  quoteAuthor: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  quoteActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  paginationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  paginationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  categoriesSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
});